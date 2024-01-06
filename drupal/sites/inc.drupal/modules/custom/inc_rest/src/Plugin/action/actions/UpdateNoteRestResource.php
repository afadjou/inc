<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\paragraphs\Entity\Paragraph;

/**
 * class UpdateNoteRestResource
 *
 * Module de traitement pour une demande de maj d'une note.
 *
 * @Action (
 *   id = "action.plugin_id.update_note",
 *   label = @Translation("Module de traitement pour une demande de maj d'une note."),
 * )
 */
class UpdateNoteRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    if (!empty($request['data'])) {
      $data = $request['data'];
      $note = Drupal::entityTypeManager()->getStorage('paragraph')->load($data['id']);
      if (!empty($note)) {
        $matter = Drupal::entityTypeManager()->getStorage('paragraph')->load($data['matter']);
        if (!empty($matter)) {
          $note->set('field_note_matiere', [
            'target_id' => $matter->id(),
            'target_revision_id' => $matter->getRevisionId()
          ]);
        }
        $note->set('field_note_note', $data['note']);
        $note->save();
        return [
          'code' => 200,
          'data' => $note->id()
        ];
      }
    }
    return [
      'code' => 200,
      'data' => t('La clé %c du flux est vide', ['%c' => 'data'])
    ];
  }
}
