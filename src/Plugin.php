<?php

namespace spicyweb\batchactions;

use Craft;
use craft\base\Model;
use craft\base\Plugin as BasePlugin;
// use craft\controllers\ElementsController;
// use craft\events\DefineElementEditorHtmlEvent;
use craft\events\TemplateEvent;
use craft\helpers\Json;
use craft\web\View;
use spicyweb\batchactions\assets\bars\BarsAsset;
use spicyweb\batchactions\models\Settings;
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
        $this->_initBarsAsset();
    }

    /**
     * @inheritdoc
     */
    protected function createSettingsModel(): ?Model
    {
        return new Settings();
    }

    /**
     * Listens for the `ElementsController::EVENT_DEFINE_EDITOR_CONTENT` event, to initialise batch action bars.
     */
    private function _initBarsAsset(): void
    {
        $request = Craft::$app->getRequest();

        if ($request->getIsCpRequest() && !$request->getIsAjax()) {
            Event::on(View::class, View::EVENT_BEFORE_RENDER_PAGE_TEMPLATE, function(TemplateEvent $event) {
                $settings = Json::encode($this->getSettings()->toArray());
                $view = Craft::$app->getView();
                $view->registerAssetBundle(BarsAsset::class);
                $view->registerJs("BatchActions.initBars($settings)");
            });
        }
    }
}
