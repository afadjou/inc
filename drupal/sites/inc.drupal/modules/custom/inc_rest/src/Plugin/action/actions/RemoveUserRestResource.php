<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Core\Session\AccountProxyInterface;

/**
 * class RemoveUserRestResource
 *
 * Module de traitement pour une demande de suppression d'un utilisateur.
 *
 * @Action (
 *   id = "action.plugin_id.remove_user",
 *   label = @Translation("Module de traitement pour une demande de suppression d'un utilisateur."),
 * )
 */
class RemoveUserRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    if (!empty($request['uid'])) {
      $user = Drupal::entityTypeManager()->getStorage('user')->load($request['uid']);
      if (!empty($user)) {
        $user->delete();
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
      'message' => t('La valeur correspondant à la clé "uid" est vide.')
    ];
  }
}
