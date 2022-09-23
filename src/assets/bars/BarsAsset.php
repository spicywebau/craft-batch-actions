<?php

namespace spicyweb\batchactions\assets\bars;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;
use spicyweb\batchactions\assets\BatchActionsAsset;

/**
 * Class BarsAsset
 *
 * @package spicyweb\batchactions\assets\bars
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.1.0
 */
class BarsAsset extends AssetBundle
{
    /**
     * @inheritdoc
     */
    public function init(): void
    {
        $this->sourcePath = __DIR__ . DIRECTORY_SEPARATOR . 'dist';

        $this->depends = [
            CpAsset::class,
        ];
        $this->css = [
            'css/bars.css',
        ];
        $this->js = [
            'js/bars.js',
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

class_alias(BarsAsset::class, BatchActionsAsset::class);
