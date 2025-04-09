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
     * @var string[]|null Handles of the only Matrix or Neo fields that should have a batch actions bar, or null to allow all except those set in barsDisallowedFields
     * @since 1.4.0
     */
    public ?array $barsAllowedFields = null;

    /**
     * @var string[] Handles of Matrix or Neo fields that shouldn't have a batch actions bar (if barsAllowedFields isn't set)
     */
    public array $barsDisallowedFields = [];
}
