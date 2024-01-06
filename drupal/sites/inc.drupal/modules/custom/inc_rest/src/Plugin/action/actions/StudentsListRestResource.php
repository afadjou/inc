<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Component\Serialization\Json;
use Drupal\Core\Session\AccountProxyInterface;

/**
 * class StudentsListRestResource
 *
 * Module de traitement pour une demande de la liste des étudiants
 *
 * @Action (
 *   id = "action.plugin_id.students",
 *   label = @Translation("Module de traitement pour une demande de la liste des étudiants."),
 * )
 */
class StudentsListRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    $students = Drupal::database()->query(
      "select
        ufd.uid,
        ufd.mail,
        ur.roles_target_id role,
        pfic.field_identite_civilite_value civilite,
        pfinu.field_identite_nom_usage_value nomUsage,
        pfip.field_identite_prenom_value prenom,
        pfinie.field_identite_nie_value nie,
        pfct.field_contact_telephone_value telephone,
        fm.uri image
        from {users_field_data} ufd " .
        "inner join user__field_user_identite ufi on ufd.uid = ufi.entity_id " .
        "inner join user__field_user_contacts ufc on ufd.uid = ufc.entity_id " .
        "inner join user__roles ur on ufd.uid = ur.entity_id " .
        "inner join user__user_picture up on ufd.uid = up.entity_id " .
        "inner join file_managed fm on up.user_picture_target_id = fm.fid " .
        "inner join paragraphs_item_field_data pifdi on ufi.field_user_identite_target_id = pifdi.id " .
        "inner join paragraphs_item_field_data pifdc on ufc.field_user_contacts_target_id = pifdc.id " .
        "inner join paragraph__field_identite_civilite pfic on pifdi.id = pfic.entity_id " .
        "inner join paragraph__field_identite_nom_usage pfinu on pifdi.id = pfinu.entity_id " .
        "inner join paragraph__field_identite_prenom pfip on pifdi.id = pfip.entity_id " .
        "inner join paragraph__field_identite_nie pfinie on pifdi.id = pfinie.entity_id " .
        "inner join paragraph__field_contact_telephone pfct on pifdc.id = pfct.entity_id " .
        "where (ufd.status = '1' and ufd.uid != '0' and ur.roles_target_id = 'etudiant')"
    )->fetchAll();

    // Traitement de certains champ si necessaire
    $students = array_map(function ($student) {
      $student->image = Drupal::service('file_url_generator')->generateAbsoluteString($student->image);
      return $student;
    }, $students);
    return [
      'code' => 200,
      'list' => Json::decode(Json::encode($students))
    ];
  }
}
