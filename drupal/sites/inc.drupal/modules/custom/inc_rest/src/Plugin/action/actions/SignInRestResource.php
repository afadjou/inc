<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\inc_rest\Rest\Entity\UserModel;
use stdClass;

/**
 * class SignRestResource
 *
 * Module de traitement pour une demande de connexion.
 *
 * @Action (
 *   id = "action.plugin_id.sign_in",
 *   label = @Translation("Module de traitement pour une demande de connexion."),
 * )
 */
class SignInRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    $user = Drupal::entityTypeManager()->getStorage('user')->load($accountProxy->id());
    if (!empty($user)) {
      $userModel = new UserModel();
      $r = new stdClass();
      $this->_restService->serializeFromClass($userModel, $r, NULL, TRUE);
      $this->_restService->setValues($this->_values, $r, $user);
      return [
        'code' => 200,
        'user' => $this->_values
      ];
    }

    return [
      'code' => 404,
      'message' => t('Erreur de chargement de l\'utilisateur')
    ];
  }
}
