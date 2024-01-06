<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\inc_rest\Rest\Entity\UserModel;
use stdClass;

/**
 * class UpdateUserRestResource
 *
 * Module de traitement pour une demande de mise à jour d'un utilisateur
 *
 * @Action (
 *   id = "action.plugin_id.update_user",
 *   label = @Translation("Module de traitement pour une demande de mise à jour d'un utilisateur."),
 * )
 */
class UpdateUserRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    if (!empty($request['user'])) {
      $user = Drupal::entityTypeManager()->getStorage('user')->load($request['user']['uid']);
      if (!empty($user)) {
        $userModel = new UserModel();
        $r = new stdClass();
        $this->_restService->serializeFromClass($userModel, $r, NULL, TRUE);
        $this->_restService->inputValues($this->_values, $r, $request['user'], $user);
        return [
          'code' => 200
        ];
      } else {
        return [
          'code' => 404,
          'message' => t('Erreur de chargement de l\'utilisateur')
        ];
      }
    }
    return [
      'code' => 404,
      'message' => t('Le flux correspondant à la clé "user" est vide.')
    ];
  }
}
