<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\paragraphs\Entity\Paragraph;

/**
 * class AddMatterRestResource
 *
 * Module de traitement pour une demande d'ajout de matière.
 *
 * @Action (
 *   id = "action.plugin_id.add_matter",
 *   label = @Translation("Module de traitement pour une demande d'ajout de matière."),
 * )
 */
class AddMatterRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    if (!empty($request['data'])) {
      $data = $request['data'];
      $matter = Paragraph::create([
        'type' => 'paragraph_matieres',
        'field_matiere_coef' => $data['coef'],
        'field_matiere_libelle' => $data['mid'],
        'field_matiere_serie' => $data['serial']
      ]);
      $matter->save();
      return [
        'code' => 200,
        'data' => $matter->id()
      ];
    }
    return [
      'code' => 200,
      'data' => t('La clé %c du flux est vide', ['%c' => 'data'])
    ];
  }
}
