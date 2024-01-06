<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Core\Session\AccountProxyInterface;

/**
 * class RemoveNoteRestResource
 *
 * Module de traitement pour une demande de suppression d'une note.
 *
 * @Action (
 *   id = "action.plugin_id.remove_note",
 *   label = @Translation("Module de traitement pour une demande de suppression d'une note."),
 * )
 */
class RemoveNoteRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    if (!empty($request['id'])) {
      $note = Drupal::entityTypeManager()->getStorage('paragraph')->load($request['id']);
      if (!empty($note)) {
        $note->delete();
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
