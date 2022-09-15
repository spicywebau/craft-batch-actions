<?php

namespace spicyweb\batchactions\assets;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;

/**
 * Class BatchActionsAsset
 *
 * @package spicyweb\batchactions\assets
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.0.0
 */
class BatchActionsAsset extends AssetBundle
{
    /**
     * @inheritdoc
     */
    public function init(): void
    {
        $this->sourcePath = '@spicyweb/batchactions/resources';

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

    /**
     * @inheritdoc
     */
    public function registerAssetFiles($view): void
    {
        $view->registerTranslations('batch-actions', [
            'Are you sure you want to delete the selected blocks?',
            'Collapse',
            'Delete',
            'Disable',
            'Enable',
            'Expand',
            'Select all',
        ]);

        parent::registerAssetFiles($view);
    }
}
