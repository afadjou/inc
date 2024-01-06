<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Core\Session\AccountProxyInterface;

/**
 * class AuthResetRestResource
 *
 * Module de traitement pour une demande de deconnexion.
 *
 * @Action (
 *   id = "action.plugin_id.auth_reset",
 *   label = @Translation("Module de traitement pour une demande de réinitialisation de mot de passe."),
 * )
 */
class AuthResetRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    $user_mail = $request['content']['mail'] ?? '';
    $user = user_load_by_mail($user_mail);

    if (!empty($user)) {
      $send = _user_mail_notify('password_reset', $user, Drupal::languageManager()->getCurrentLanguage()->getId());
      if (!empty($send)) {
        return [
          'code' => 200,
          'message' => t('Un message a été envoyé à votre adresse email %mail pour votre demande de réinitialisation de mot de passe.', ['%mail' => $user_mail])
        ];
      } else {
        return [
          'code' => 404,
          'message' => t('L\'adresse email %mail n\'existe pas.', ['%mail' => $user_mail])
        ];
      }
    }
    return [
      'code' => 404,
      'message' => t('Aucun utilisateur associé à l\'adresse email %mail', ['%mail' => $user_mail])
    ];
  }
}
