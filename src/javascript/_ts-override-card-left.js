/*
 * overrides to allow for editing empty fields on the card
 * 
 */
 Ext.override(Rally.ui.renderer.template.LabeledFieldTemplate, {
    apply: function(values) {
        var valueStr = this.valueTemplate.apply(values);
        if (valueStr.length < 1) {
            valueStr = "--";
            //return valueStr;
        }

        var renderedValue = [
            '<div class="rui-field-value">',
            valueStr,
            '</div>'
        ];

        if (this.fieldLabel) {
            renderedValue = [
                '<span class="rui-field-label">',
                Ext.htmlEncode(this.fieldLabel),
                ':</span>'
            ].concat(renderedValue);
        }

        return renderedValue.join('');
    }
});

Ext.override(Rally.ui.cardboard.plugin.CardContentLeft,{

    _getRenderTpl: function(fieldDefinition) {
        console.log('_getRenderTpl',fieldDefinition);
        
        var card = this.card,
            modelField = card.getRecord().getField(fieldDefinition.name),
            hasData = true /*(Ext.isFunction(fieldDefinition.hasValue) && fieldDefinition.hasValue()) || card.getRecord().hasValue(modelField)*/,
            isRenderable = hasData || (modelField && modelField.isCollection());

        if (modelField && modelField.isHidden) {
            return null;
        }

        if (!isRenderable) {
            return null;
        }

        if (!fieldDefinition.renderTpl && modelField) {
            return Rally.ui.cardboard.CardRendererFactory.getRenderTemplate(modelField);
        }

        return fieldDefinition.renderTpl;
    },

    _getFieldHtml: function(fieldDefinition) {
        var html = '',
            cls = '',
            typeCls = '',
            tpl = this._getRenderTpl(fieldDefinition);

        if (tpl) {
            html = tpl.apply(this.card.getRecord().data);
            var card = this.card;
            
            // don't show collections unless there's a value
            var modelField = card.getRecord().getField(fieldDefinition.name);
            var hasData = (Ext.isFunction(fieldDefinition.hasValue) && fieldDefinition.hasValue()) || card.getRecord().hasValue(modelField);
            if ( modelField && modelField.isCollection() && !hasData ) {
                return '';
            }
            
            if (html) {
                cls = this._isStatusField(fieldDefinition) ? 'status-field ' : '';

                var field = this.card.getRecord().self.getField(fieldDefinition.name);
                if (field && field.attributeDefinition) {
                    typeCls = ' type-' + field.attributeDefinition.AttributeType.toLowerCase();
                }
                html = '<div class="field-content ' + cls + fieldDefinition.name + typeCls + '">' + html + '</div>';
            }
        }

        return html;
    }

});
