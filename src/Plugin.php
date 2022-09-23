<?php

namespace spicyweb\batchactions;

use Craft;
use craft\base\Plugin as BasePlugin;
use craft\controllers\ElementsController;
use craft\events\DefineElementEditorHtmlEvent;
use spicyweb\batchactions\assets\bars\BarsAsset;
use yii\base\Event;

/**
 * Class Plugin
 *
 * @package spicyweb\batchactions
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.0.0
 */
class Plugin extends BasePlugin
{
    /**
     * @inheritdoc
     */
    public function init(): void
    {
        parent::init();

        $request = Craft::$app->getRequest();

        if ($request->getIsCpRequest() && !$request->getIsAjax()) {
            Event::on(
                ElementsController::class,
                ElementsController::EVENT_DEFINE_EDITOR_CONTENT,
                function(DefineElementEditorHtmlEvent $e) {
                    Craft::$app->getView()->registerAssetBundle(BarsAsset::class);
                }
            );
        }
    }
}
