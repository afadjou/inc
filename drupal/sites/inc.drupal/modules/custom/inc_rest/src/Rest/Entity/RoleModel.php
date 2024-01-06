<?php

namespace Drupal\inc_rest\Rest\Entity;

/**
 * Class ContactModel.
 */
class RoleModel {

  /**
   * Machine name.
   *
   * @var string
   *
   * @drupalField id
   */
  public string $id = '';

  /**
   * Label.
   *
   * @var string
   *
   * @drupalField label
   */
  public string $label = '';
  /**
   * Permissions.
   *
   * @var array
   *
   * @drupalField permissions
   */
  public array $permissions = [];
}
