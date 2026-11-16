<?php
declare(strict_types=1);

const OMSTAM_ADMIN_EMAIL = 'y0548431060@gmail.com';
const OMSTAM_FROM_EMAIL = 'noreply@omstam.com';
const OMSTAM_SITE_NAME = 'מכון אמנות הסת"ם';
const OMSTAM_LOG_FILE = __DIR__ . '/private/contact-log.txt';

header('Content-Type: application/json; charset=UTF-8');

function json_out(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['ok' => false, 'error' => 'method_not_allowed'], 405);
}

// Honeypot: real users never fill this hidden field, bots often do.
if (!empty($_POST['website'] ?? '')) {
    json_out(['ok' => true]); // pretend success, drop silently
}

$name = trim(strip_tags($_POST['name'] ?? ''));
$phone = trim(strip_tags($_POST['phone'] ?? ''));
$email = trim(strip_tags($_POST['email'] ?? ''));
$message = trim(strip_tags($_POST['message'] ?? ''));
$formType = trim(strip_tags($_POST['form_type'] ?? 'contact'));
$consent = trim(strip_tags($_POST['consent'] ?? ''));
$campaignFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid'];
$campaign = [];
foreach ($campaignFields as $field) {
    $campaign[$field] = trim(strip_tags($_POST[$field] ?? ''));
}

if ($formType === 'newsletter') {
    if ($name === '') {
        json_out(['ok' => false, 'error' => 'name_required'], 422);
    }
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_out(['ok' => false, 'error' => 'invalid_email'], 422);
    }
    if ($consent !== 'yes') {
        json_out(['ok' => false, 'error' => 'consent_required'], 422);
    }

    $subscriberName = $name;
    $subject = 'הרשמה חדשה למאמר השבועי - ' . $subscriberName;
    $body = "הרשמה חדשה למאמר השבועי באתר מכון אמנות הסת\"ם\n\n"
        . "שם: {$subscriberName}\n"
        . "אימייל: {$email}\n"
        . "אישור דיוור: כן\n"
        . "עמוד מקור: " . ($_SERVER['HTTP_REFERER'] ?? '-') . "\n";

    $headers = 'From: ' . OMSTAM_SITE_NAME . ' <' . OMSTAM_FROM_EMAIL . ">\r\n"
        . 'Reply-To: ' . $email . "\r\n"
        . 'Content-Type: text/plain; charset=UTF-8' . "\r\n";

    $sent = function_exists('mail') ? @mail(OMSTAM_ADMIN_EMAIL, $subject, $body, $headers) : false;

    @mkdir(__DIR__ . '/private', 0755, true);
    @file_put_contents(
        __DIR__ . '/private/newsletter-log.txt',
        '[' . date('c') . '] sent=' . ($sent ? 'yes' : 'no') . " name={$subscriberName} email={$email} consent=yes\n",
        FILE_APPEND | LOCK_EX
    );

    if (!$sent) {
        json_out(['ok' => false, 'error' => 'mail_failed'], 500);
    }

    json_out(['ok' => true]);
}

if ($name === '' || $phone === '') {
    json_out(['ok' => false, 'error' => 'missing_required_fields'], 422);
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_out(['ok' => false, 'error' => 'invalid_email'], 422);
}

$subject = 'פנייה חדשה מהאתר - ' . $name;
$body = "פנייה חדשה מטופס יצירת הקשר באתר מכון אמנות הסת\"ם\n\n"
    . "שם: {$name}\n"
    . "טלפון: {$phone}\n"
    . "אימייל: " . ($email !== '' ? $email : '-') . "\n\n"
    . "הודעה:\n" . ($message !== '' ? $message : '-') . "\n\n"
    . "מקור הפנייה:\n"
    . "source: " . ($campaign['utm_source'] ?: '-') . "\n"
    . "medium: " . ($campaign['utm_medium'] ?: '-') . "\n"
    . "campaign: " . ($campaign['utm_campaign'] ?: '-') . "\n"
    . "content: " . ($campaign['utm_content'] ?: '-') . "\n"
    . "term: " . ($campaign['utm_term'] ?: '-') . "\n"
    . "gclid: " . ($campaign['gclid'] ?: '-') . "\n"
    . "gbraid: " . ($campaign['gbraid'] ?: '-') . "\n"
    . "wbraid: " . ($campaign['wbraid'] ?: '-') . "\n";

$headers = 'From: ' . OMSTAM_SITE_NAME . ' <' . OMSTAM_FROM_EMAIL . ">\r\n"
    . 'Content-Type: text/plain; charset=UTF-8' . "\r\n";
if ($email !== '') {
    $headers .= 'Reply-To: ' . $email . "\r\n";
}

$sent = function_exists('mail') ? @mail(OMSTAM_ADMIN_EMAIL, $subject, $body, $headers) : false;

@mkdir(__DIR__ . '/private', 0755, true);
@file_put_contents(
    OMSTAM_LOG_FILE,
    '[' . date('c') . '] sent=' . ($sent ? 'yes' : 'no') . " name={$name} phone={$phone} email={$email}"
    . " source={$campaign['utm_source']} medium={$campaign['utm_medium']} campaign={$campaign['utm_campaign']}\n",
    FILE_APPEND | LOCK_EX
);

if (!$sent) {
    json_out(['ok' => false, 'error' => 'mail_failed'], 500);
}

json_out(['ok' => true]);
