<script>
// import Util, {Rect} from '@/scripts/Util.js'

export default {
  methods: {
    
    arrangePopup (target, base, offset, ignore_tf) {
      if (typeof offset === 'undefined') offset = {x:0, y:0}
      if (typeof ignore_tf === 'undefined') ignore_tf = false

      target.style.top = 0
      target.style.left = 0
      const target_abs_pos = this._absPosition(target, ignore_tf)
      const target_rel_pos = this._relPosition(target)
      const target_h = parseFloat(target.offsetHeight)
      const target_w = parseFloat(target.offsetWidth)
            
      // getBBoxはbaseがsvg要素の場合
      const base_abs_pos = 
        base instanceof Rect
          ? {x:base.x, y:base.y}
          : this._absPosition(base, ignore_tf)
      const base_h = 
        base instanceof Rect 
          ? base.height
          : parseFloat(base.getBBox ? base.getBBox().height : base.offsetHeight)
      const base_w = 
        base instanceof Rect 
          ? base.width
          : parseFloat(base.getBBox ? base.getBBox().width : base.offsetWidth)
      
      const dx = base_abs_pos.x - target_abs_pos.x
      const dy = base_abs_pos.y - target_abs_pos.y
      
      const doc_w = parseFloat(document.documentElement.clientWidth)
      const doc_h = parseFloat(document.documentElement.clientHeight)

      const scroll_x = window.pageXOffset
      const scroll_y = window.pageYOffset
            
      let x, y
      if (base_abs_pos.x + target_w + offset.x > doc_w + scroll_x) {
        // 画面右端を超過する
        x = dx + offset.x - target_w + base_w
      } else {
        x = dx + offset.x
      }
      
      if (base_abs_pos.y - target_h - offset.y < scroll_y) {
        // 画面上端を超過する
        y = dy + base_h + offset.y
      } else {
        y = dy - target_h - offset.y
      }

      // console.log('offset=', offset)
      // console.log('target=', target)
      // console.log('base=', base)
      // console.log('(scroll_x,scroll_y)=', scroll_x, scroll_y)
      // console.log('target_abs_pos:', target_abs_pos)
      // console.log('target_rel_pos:', target_rel_pos)
      // console.log('target (w,h)=', target_w, target_h)
      // console.log('base_abs_pos:', base_abs_pos)
      // console.log('base (w,h)=', base_w, base_h)
      // console.log('(dx,dy)=', dx, dy)
      // console.log('doc (w,h)=', doc_w, doc_h)
      // console.log('(x,y)=',x,y)
      
      target.style.left = x + 'px'
      target.style.top = y + 'px'
    },

    _absPosition (elm, ignore_tf) {
      const rect = elm.getBoundingClientRect()
      // console.log(rect)
      const style = window.getComputedStyle(elm)
      const vendors = ['webkit', 'Moz']
      let transform
      vendors.some(v => {
        if (style[v+'Transform']) {
          transform = style[v+'Transform']
          return true
        }
      })
      
      const REG_MATRIX = /matrix\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/
      const ts = {x:0, y:0}
      if (!ignore_tf) {
        let matched
        if (transform && (matched=transform.match(REG_MATRIX))) {
          const m = matched.slice(1)
          ts.x = m[4]
          ts.y = m[5]
        }
        // console.log('(ts.x,ts.y)=',ts.x,ts.y)
      }

      return {
        x: window.pageXOffset + rect.x - ts.x,
        y: window.pageYOffset + rect.y - ts.y
      }
    },

    _relPosition (elm) {
      const style = window.getComputedStyle(elm)
      return {
        x: parseFloat(style.left.replace(/px/, '')),
        y: parseFloat(style.top.replace(/px/, ''))
      }
    },
  }
}
</script>

<style lang="scss" scoped>
</style>