<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\paragraphs\Entity\Paragraph;

/**
 * class AddRNRestResource
 *
 * Module de traitement pour une demande d'ajout de relevés de notes.
 *
 * @Action (
 *   id = "action.plugin_id.add_rn",
 *   label = @Translation("Module de traitement pour une demande d'ajout de relevé de notes."),
 * )
 */
class AddRNRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    if (!empty($request['data'])) {
      $data = $request['data'];
      $rn = Paragraph::create([
        'type' => 'paragraph_releve_notes',
        'field_releve_centre' => $data['center'],
        'field_releve_sous_centre' => $data['scenter'],
        'field_releve_serie' => $data['serial'],
        'field_releve_numero_table' => $data['n_table'],
        'field_releve_session' => $data['session'],
        'field_releve_examen' => $data['type'],
        'field_releve_etudiant' => $data['student'],
        'field_releve_deliberation' => $data['deliberation_date']
      ]);

      $rn->save();
      return [
        'code' => 200,
        'data' => $rn->id()
      ];
    }
    return [
      'code' => 200,
      'data' => t('La clé %c du flux est vide', ['%c' => 'data'])
    ];
  }
}
