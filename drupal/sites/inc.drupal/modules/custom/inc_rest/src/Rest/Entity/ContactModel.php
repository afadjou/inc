<?php

namespace Drupal\inc_rest\Rest\Entity;

/**
 * Class ContactModel.
 */
class ContactModel {

  /**
   * Téléphone.
   *
   * @var string
   *
   * @drupalField field_contact_telephone
   */
  public string $telephone = '';
  /**
   * Contact actif.
   *
   * @var bool
   * @drupalField field_contact_actif
   */
  public bool $actif = true;
}
