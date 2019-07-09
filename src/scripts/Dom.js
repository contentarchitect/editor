export default class Dom {
    static position (node, parent, scroll) {
        if (typeof parent==='undefined') parent = node.parentNode
        
        let p_rect = parent.nodeType==1 ? parent.getBoundingClientRect() : {x:0,y:0}
        let rect = node.getBoundingClientRect()

        return {
            x: rect.x - p_rect.x + (scroll ? window.pageXOffset : 0),
            y: rect.y - p_rect.y + (scroll ? window.pageYOffset : 0),
        }
    }

    static convertSelectionBoundsAsDom (selectionBounds) {
        return {
            
        }
    }
}