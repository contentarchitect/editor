<template>
  <div>
    <!-- <p
      contenteditable="true"
      ref="p"
      @keypress.enter.prevent="addNewBlock"
      @keyup.delete.prevent="removeBlock"
      @keyup="$emit('move-caret-up', $event)"
      @keyup.down.prevent="$emit('move-caret-down', $event)"
      @input="input">
    </p> -->

    <quill-editor
        v-model="value"
        ref="myQuillEditor"
        :options="editorOption"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)" />

    <!-- <div ref="quill">
    </div> -->
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import Dom from "@/scripts/Dom"
import Button from '@/components/Button'


function placeCaretAtEnd(el) {
  el.focus();
  if (typeof window.getSelection != "undefined"
      && typeof document.createRange != "undefined") {
    var range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (typeof document.body.createTextRange != "undefined") {
    var textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(false);
    textRange.select();
  }
}
// https://stackoverflow.com/questions/7451468/contenteditable-div-how-can-i-determine-if-the-cursor-is-at-the-start-or-end-o/7478420#7478420
function isCaretEnd (el) {
  var selRange, testRange;

  var sel = window.getSelection();
  
  if (sel.rangeCount) {
    selRange = sel.getRangeAt(0);
    testRange = selRange.cloneRange();

    testRange.selectNodeContents(el);
    testRange.setStart(selRange.endContainer, selRange.endOffset);
    return testRange.toString() == "";
  }

  return false;
}
// https://stackoverflow.com/questions/7451468/contenteditable-div-how-can-i-determine-if-the-cursor-is-at-the-start-or-end-o/7478420#7478420
function isCaretStart (el) {
  var selRange, testRange;

  var sel = window.getSelection();
  
  if (sel.rangeCount) {
    selRange = sel.getRangeAt(0);
    testRange = selRange.cloneRange();

    testRange.selectNodeContents(el);
    testRange.setEnd(selRange.startContainer, selRange.startOffset);
    return testRange.toString() == "";
  }

  return false;
}

export default {
  props: {
    value: String,
  },
  data () {
    return {
      // quill: null,
      showToolbar: false,
      showEditor: false,
      appliedStyles: [],
    }
  },
  components: {
    quillEditor,
    "ui-button": Button
  },
  mounted() {
    // this.$refs.p.innerHTML = this.value;
    // this.$refs.quill.innerHTML = this.value;
    // var p = this.$refs.p,
    //     s = window.getSelection(),
    //     r = document.createRange();

    // r.setStart(p, 0);
    // r.setEnd(p, 0);
    // s.removeAllRanges();
    // s.addRange(r);

    // this.initQuill();
  },
  methods: {
    input(event) {
      this.$emit("input", event.target.innerHTML)
    },
    addNewBlock (event) {
      if (isCaretEnd(this.$refs.p) && !isCaretStart(this.$refs.p)) {
        this.$emit("add-new-block", event);
      }
    },
    removeBlock (event) {
      if (isCaretStart(this.$refs.p)) {
        this.$emit("remove-block", event);
      }
    },

    setCaretLast () {
      placeCaretAtEnd(this.$refs.p)
    },

    initQuill () {
      if (this.quill) return

      var vue = this;

      this.quill = new Quill(this.$refs.quill, {
        theme: "bubble",
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'code-block'],        // toggled buttons
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'align': [] }],
          ],
          keyboard: {
            bindings: {
              // enter: {
              //   key: 13,
              //   handler (range, context) {
              //     vue.$emit('enter')
              //     return false
              //   }
              // }
            },
          }
        }
      });

      let domContainer = this.quill.container.querySelector(".ql-editor")
      domContainer.innerHTML = this.value
    },

  },
  watch: {
    value (newval) {
      if (newval != this.$refs.p.innerHTML) {
        this.$refs.p.innerHTML = newval;
      }
    }
  }
}
</script>

<style>
@import '../assets/quill.bubble.custom.css';

.ql-bubble .ql-tooltip {
  border-radius: 3px;
  background-color: #121212;
}

.ql-bubble .ql-tooltip:not(.ql-flip) .ql-tooltip-arrow {
  border-bottom-color: #121212;
}

.ql-tooltip {
  z-index: 1;
}

.ql-clipboard {
  display: none;
}
</style>