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
      $id = $request['id'];
      $result = Drupal::database()->query("delete from {paragraphs_item_field_data} where(type = 'paragraph_notes' and id = " . $id . ")")->execute();
      if ($result) {
        return [
          'code' => 200,
        ];
      }
    }
    return [
      'code' => 404,
      'message' => t('La note n\'a pas été supprimée.')
    ];
  }
}
