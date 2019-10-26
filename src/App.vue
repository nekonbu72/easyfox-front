<template>
  <div>
    <div class="header">
      <div class="header item flex">
        <input type="text" class="path" v-model="path" required readonly />
      </div>
      <div class="header item solid" v-show="isHeaderSolidShown">
        <input type="submit" class="btn update" @click="updateDirTree" value="->" />
        <input type="submit" class="btn save" value="Save" />
        <input type="submit" class="btn exe" value="Exe" />
        <label class="status">{{status}}</label>
      </div>
    </div>
    <div class="body">
      <div class="body item solid" @dragover="handleDragOver" v-show="isBodySolidShown">
        <input type="submit" class="btn close" value="-" @click="closeAllDetails" />
        <DirTree @updatePath="updatePath" class="tree" :trees="trees" :editor="editor" />
      </div>
      <div
        class="gutter"
        draggable="true"
        @dragstart="handleGutterDragStart"
        @dragend="handleGutterDragEnd"
        v-show="isBodySolidShown"
      ></div>
      <div class="body item flex" @dragover="handleDragOver">
        <div id="editor"></div>
      </div>
    </div>
  </div>
</template>

<script>
import DirTree from "./components/DirTree.vue";
import { getDirTree, DirTree as Tree } from "./modules/http";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export default {
  name: "app",
  components: {
    DirTree
  },
  data() {
    return {
      path: "C:\\easyfox_test",
      status: "Waiting...",

      /**
       * @type {Tree[]}
       */
      trees: [],

      /**
       * @type {monaco.editor.IStandaloneCodeEditor}
       */
      editor: {},

      isHeaderSolidShown: true,
      isBodySolidShown: true,

      /**
       * @type {HTMLDivElement}
       */
      bodySolid: {},

      beforeClientX: -1,
      afterClientX: -1
    };
  },
  computed: {
    minSolidWidth() {
      return 700;
    }
  },
  mounted() {
    this.initHeaderSolidShown();
    this.initBodySolid();
    this.initBodySolidShown();
    this.initEditor();
    this.updateDirTree();
  },
  methods: {
    initHeaderSolidShown() {
      window.addEventListener("resize", () => {
        const header = this.$el.querySelector(".header");
        this.isHeaderSolidShown = header.clientWidth >= this.minSolidWidth;
      });
    },

    initBodySolid() {
      this.bodySolid = this.$el.querySelector(".body.item.solid");
    },

    initBodySolidShown() {
      window.addEventListener("resize", () => {
        const body = this.$el.querySelector(".body");
        const beforeIsBodySolidShown = this.isBodySolidShown;
        this.isBodySolidShown = body.clientWidth >= this.minSolidWidth;
        if (this.isBodySolidShown !== beforeIsBodySolidShown) {
          //
          this.editor.layout();
        }
      });
    },

    /**
     * @param {DragEvent} event
     */
    handleGutterDragStart(event) {
      // Firefox52 では setData しないと drag イベントが発生しない
      event.dataTransfer.setData("text/plain", "");
      this.beforeClientX = event.clientX;
    },

    handleGutterDragEnd() {
      const moveX = this.afterClientX - this.beforeClientX;
      const style = window.getComputedStyle(this.bodySolid);
      const widthPx = style.getPropertyValue("width");
      const width = parseFloat(widthPx);
      this.bodySolid.style.width = `${width + moveX}px`;
      this.beforeClientX = this.afterClientX;
      //
      this.editor.layout();
    },
    /**
     * @param {DragEvent} event
     */
    handleDragOver(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      // dragend イベントでは clientX を取得できないため dragover で取得
      this.afterClientX = event.clientX;
    },

    initEditor() {
      this.editor = monaco.editor.create(document.getElementById("editor"), {
        language: "javascript",
        minimap: { enabled: false }
      });
      window.addEventListener("resize", () => {
        this.editor.layout();
      });
    },

    async updateDirTree() {
      const timerStart = new Date();
      this.status = "Loading...";

      const tree = await getDirTree();
      this.trees = tree.children;

      const timerEnd = new Date();
      const timeGap = timerEnd.getTime() - timerStart.getTime();
      this.status = `Done(${timeGap / 1000}s).`;
    },

    closeAllDetails() {
      const tree = this.$el.querySelector("tree");
      tree
        .querySelectorAll("details")
        .forEach(details => (details.open = false));
    },

    /**
     * @param{string}newPath
     */
    updatePath(newPath) {
      this.path = newPath;
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  height: 34px;
}

.header.item.flex {
  flex: 1;
  white-space: nowrap;
}

.header.item.flex .path {
  width: 100%;
  padding: 0;
  box-sizing: border-box;
}

.header.item.solid {
  display: flex;
  width: fit-content;
}

.header.item.solid * {
  flex: 0 1 auto;
  margin: 0 1vh;
  padding: 0 2vh;
}

.body {
  display: flex;
  height: 85vh;
  margin-top: 2vh;
}

.body.item {
  white-space: nowrap;
  margin: 0;
}

.body.item.solid {
  width: 50vh;
  overflow-y: scroll;
  overflow-x: hidden;
  display: block;
}

.btn.close {
  height: 34px;
  width: 34px;
}

.body .gutter {
  width: 5px;
  background-color: #ccc;
  cursor: ew-resize;
}

.body.item.flex {
  flex: 1;
  overflow-x: scroll;
}

#editor {
  width: calc(100% - 2px);
  border: 1px solid #ccc;
}
</style>
