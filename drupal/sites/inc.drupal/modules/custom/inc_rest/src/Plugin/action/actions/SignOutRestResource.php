<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal\Core\Session\AccountProxyInterface;

/**
 * class SignOutRestResource
 *
 * Module de traitement pour une demande de deconnexion.
 *
 * @Action (
 *   id = "action.plugin_id.sign_out",
 *   label = @Translation("Module de traitement pour une demande de deconnexion."),
 * )
 */
class SignOutRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    user_user_logout($accountProxy);
    return [
      'code' => 200,
      'user' => []
    ];
  }
}
