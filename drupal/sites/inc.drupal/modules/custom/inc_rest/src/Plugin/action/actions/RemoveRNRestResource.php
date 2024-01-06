<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Core\Session\AccountProxyInterface;

/**
 * class RemoveRNRestResource
 *
 * Module de traitement pour une demande de suppression d'un relevé de notes.
 *
 * @Action (
 *   id = "action.plugin_id.remove_rn",
 *   label = @Translation("Module de traitement pour une demande de suppression d'un relevé de notes."),
 * )
 */
class RemoveRNRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    if (!empty($request['rnid'])) {
      $matter = Drupal::entityTypeManager()->getStorage('paragraph')->load($request['rnid']);
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
