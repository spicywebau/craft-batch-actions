<?php

namespace spicyweb\blockbatchactions\assets;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;

/**
 * Class BlockBatchActionsAsset
 *
 * @package spicyweb\blockbatchactions\assets
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.0.0
 */
class BlockBatchActionsAsset extends AssetBundle
{
    /**
     * @inheritdoc
     */
    public function init(): void
    {
        $this->sourcePath = '@spicyweb/blockbatchactions/resources';

        $this->depends = [
            CpAsset::class,
        ];
        $this->css = [
            'css/main.css',
        ];
        $this->js = [
            'js/main.js',
        ];

        parent::init();
    }
}
