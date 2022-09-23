<?php

namespace spicyweb\batchactions\models;

use craft\base\Model;

/**
 * Class Settings
 *
 * @package spicyweb\batchactions\models
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.1.0
 */
class Settings extends Model
{
    /**
     * @var string[] Handles of Matrix or Neo fields that shouldn't have a batch actions bar
     */
    public array $barsDisallowedFields = [];
}
