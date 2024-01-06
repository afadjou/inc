<?php

namespace Drupal\inc_rest\Rest\Entity;

use stdClass;

/**
 * Class SignInResponseModel.
 */
class UserModel {

  /**
   * ID utilisateur.
   *
   * @var int
   * @drupalField uid
   */
  public int $uid = 0;
  /**
   * Identifiant de l'utilisateur
   *
   * @var string
   * @drupalField name
   */
  public string $name = '';
  /**
   * Email de l'utilisateur
   *
   * @var string
   * @drupalField mail
   */
  public string $mail = '';
  /**
   * Date de création
   *
   * @var int
   * @plugin validation_data_format date
   * @presave presave_process_plugin date
   * @drupalField created
   */
  public int $created = 0;
  /**
   * Date dernière modification
   *
   * @var int
   * @plugin validation_data_format date
   * @presave presave_process_plugin date
   * @drupalField changed
   */
  public int $changed = 0;
  /**
   * Rôles de l'utilisateur.
   *
   * @var Drupal\inc_rest\Rest\Entity\RoleModel
   * @presave presave_process_plugin roles
   *
   * @drupalField entity.user.roles
   */
  public $roles = [];
  /**
   * Photo de profile utilisateur.
   *
   * @var Drupal\inc_rest\Rest\Entity\ImageModel
   * @presave presave_process_plugin contentToFile
   *
   * @drupalField entity.user.user_picture
   */
  public $image;
  /**
   * Données civilités
   *
   * @var Drupal\inc_rest\Rest\Entity\IdentiteModel
   *
   * @drupalField paragraph.identite.field_user_identite
   */
  public $identite;
  /**
   * Adresses de l'utilisateur
   *
   * @var Drupal\inc_rest\Rest\Entity\AdresseModel
   *
   * @drupalField paragraph.adresses.field_user_adresses
   */
  public $adresses = [];
  /**
   * Données de contact
   *
   * @var Drupal\inc_rest\Rest\Entity\ContactModel
   *
   * @drupalField paragraph.contact.field_user_contacts
   */
  public $contact = [];
}
