<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Core\Session\AccountProxyInterface;

/**
 * class RemoveMatterRestResource
 *
 * Module de traitement pour une demande de suppression d'une matière.
 *
 * @Action (
 *   id = "action.plugin_id.remove_matter",
 *   label = @Translation("Module de traitement pour une demande de suppression d'une matière."),
 * )
 */
class RemoveMatterRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    if (!empty($request['mid'])) {
      $matter = Drupal::entityTypeManager()->getStorage('paragraph')->load($request['mid']);
      if (!empty($matter)) {
        $matter->delete();
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
