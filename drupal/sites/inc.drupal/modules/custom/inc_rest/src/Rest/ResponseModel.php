<?php

namespace Drupal\inc_rest\Rest;

/**
 * Class ResponseModel.
 */
class ResponseModel {

  /**
   * Code de retour.
   *
   * @var int
   */
  public int $code = 200;

  /**
   * Messages de retour.
   *
   * @var array
   */
  public array $messageretour = [];
}
