#!groovy
@Library('da-pipelines@main') _

// ============================================================================
// OMSTAM CI/CD. Sitio estatico HTML + PHP-FPM (contact-handler.php), sin
// estado ni secretos. Repo en una cuenta de GitHub distinta (github-omstam /
// omstam-web) -- el job Jenkins necesita su propia credencial de checkout,
// GITHUB_USER_PAT (yadstam-cyber) NO tiene acceso a este repo.
//
// Para cada push/MR:
//   1. Init        - detecta [ci-skip], rama desplegable, autor
//   2. MR scans    - trivy fs + secret + KICS (solo ramas NO desplegables)
//   3. Build&Push  - kaniko build + push de la unica imagen
//   4. Update IaC  - bump de image.tag en da-iac + commit [ci-skip]
//
// "Desplegable" = rama main (la default de este repo) o rama HF-*.
// ============================================================================

def gitCommitter = ''
def version = ''
def skipCi = false
def isDeployable = false
def hasBuildableChanges = true

def addBuildText(String text) {
    currentBuild.description = currentBuild.description ? "${currentBuild.description} | ${text}" : text
}

// START UPDATE HERE ----------------------------------------------------------
def cloud_name       = "kubernetes"
def pod_template     = "podTemplates/yadstamPodTemplate.yaml"
def service_account  = "jenkins"

def registry         = "ghcr.io/yadstam-cyber"
def image_name       = "omstam"
def dockerfile        = "Dockerfile"
def version_base      = "0.1.0"

// da-iac SI es de yadstam-cyber -- este checkout usa GITHUB_USER_PAT normal,
// solo el checkout del codigo fuente (config del job Jenkins) necesita otra
// credencial.
def iac_repo_url     = "https://github.com/yadstam-cyber/da-iac.git"
def iac_repo_branch  = "main"
def iac_repo_cred_id = "GITHUB_USER_PAT"
// STOP UPDATE HERE -----------------------------------------------------------

pipeline {
    options {
        timeout(time: 60, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }
    agent {
        kubernetes {
            cloud "${cloud_name}"
            serviceAccount "${service_account}"
            yaml libraryResource("${pod_template}")
        }
    }
    stages {

        stage('Init Job') {
            steps {
                script {
                    def skip = sh(script: "git log -1 --pretty=%B | grep -q '\\[ci-skip\\]'", returnStatus: true)
                    if (skip == 0) {
                        currentBuild.result = 'NOT_BUILT'
                        skipCi = true
                        addBuildText("SKIP_CI")
                        return
                    }
                    gitCommitter = sh(script: "git --no-pager show -s --format='%an' \$GIT_COMMIT", returnStdout: true).trim()

                    def branch = env.BRANCH_NAME ?: env.GIT_BRANCH
                    if (branch == 'main' || branch ==~ /^HF-.*/) {
                        isDeployable = true
                    }
                    version = "${version_base}-${env.BUILD_NUMBER}"
                    addBuildText("by=${gitCommitter} deployable=${isDeployable} v=${version}")
                }
            }
        } // Init Job

        stage('Detect changes') {
            when { expression { !skipCi } }
            steps {
                script {
                    def changedFiles
                    if (env.CHANGE_ID) {
                        def target = env.CHANGE_TARGET ?: 'main'
                        sh "git fetch --no-tags origin ${target} || true"
                        def base = sh(script: "git merge-base origin/${target} HEAD", returnStdout: true).trim()
                        changedFiles = sh(script: "git diff --name-only ${base} HEAD", returnStdout: true).trim()
                    } else {
                        changedFiles = sh(script: "git diff --name-only HEAD~1 HEAD 2>/dev/null || git ls-files", returnStdout: true).trim()
                    }
                    def files = changedFiles.tokenize('\n')
                    echo "Changed files:\n${changedFiles}"

                    hasBuildableChanges = files.any {
                        !(it.endsWith('.md') || it.startsWith('docs/'))
                    }
                    addBuildText(hasBuildableChanges ? "build needed" : "docs only")
                }
            }
        } // Detect changes

        stage('MR Scans') {
            when { expression { !skipCi && !isDeployable } }
            parallel {
                stage('Trivy Filesystem Scan') {
                    steps { script { trivyScan.fileScan() } }
                }
                stage('Secret Scan') {
                    steps { script { trivyScan.secretScan() } }
                }
                stage('KICS Dockerfile Scan') {
                    steps {
                        script {
                            if (fileExists(dockerfile)) { kicsDockerfileScan(dockerfile) }
                        }
                    }
                }
            }
        } // MR Scans

        stage('Build & Push Image') {
            when { expression { !skipCi && isDeployable && hasBuildableChanges } }
            steps {
                script {
                    def dest = "--destination ${registry}/${image_name}:${version} " +
                               "--destination ${registry}/${image_name}:latest"
                    kanikoCommand("${dest} --dockerfile=${dockerfile}", "--context `pwd`")
                }
            }
        } // Build & Push Image

        stage('Update IaC') {
            when { expression { !skipCi && isDeployable && hasBuildableChanges } }
            steps {
                script {
                    checkoutRepo("${iac_repo_branch}", "da-iac", "${iac_repo_url}", "${iac_repo_cred_id}")
                    dir("da-iac") {
                        def file = "services/${image_name}/values.yaml"
                        if (fileExists(file)) {
                            sh "sed -i -E 's|^([[:space:]]*tag:).*|\\1 \"${version}\"|' ${file}"
                            echo "Bumped ${file} -> ${version}"
                            updateGitlab("${iac_repo_cred_id}", "${iac_repo_branch}",
                                         "[ci-skip] Bump omstam image tag to ${version}", "services", "push")
                        } else {
                            error("No existe ${file} en da-iac: la imagen ${version} se publico pero NO se desplegara.")
                        }
                    }
                }
            }
        } // Update IaC

    } // stages

    post {
        success {
            script {
                if (isDeployable && hasBuildableChanges) {
                    addBuildText("pushed: ${image_name} @ ${version}")
                }
            }
        }
    }
} // pipeline
