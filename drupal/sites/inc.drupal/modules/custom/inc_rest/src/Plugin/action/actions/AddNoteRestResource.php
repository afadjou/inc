<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\paragraphs\Entity\Paragraph;

/**
 * class AddNoteRestResource
 *
 * Module de traitement pour une demande d'ajout d'une note.
 *
 * @Action (
 *   id = "action.plugin_id.add_note",
 *   label = @Translation("Module de traitement pour une demande d'ajout d'une note."),
 * )
 */
class AddNoteRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    if (!empty($request['data'])) {
      $data = $request['data'];
      $rn = Drupal::entityTypeManager()->getStorage('paragraph')->load($data['releve']);
      $matter = Drupal::entityTypeManager()->getStorage('paragraph')->load($data['matter']);

      if (!empty($rn) && !empty($matter)) {
        $note = Paragraph::create([
          'type' => 'paragraph_notes',
          'field_note_matiere' => [
            'target_id' => $matter->id(),
            'target_revision_id' => $matter->getRevisionId()
          ],
          'field_note_note' => $data['note'],
          'field_note_releve' => [
            'target_id' => $rn->id(),
            'target_revision_id' => $rn->getRevisionId()
          ]
        ]);

        $note->save();
        return [
          'code' => 200,
          'data' => $note->id()
        ];
      } else {
        return [
          'code' => 404,
          'message' => t('Impossible de charger le relevé de note')
        ];
      }
    }
    return [
      'code' => 200,
      'data' => t('La clé %c du flux est vide', ['%c' => 'data'])
    ];
  }
}
