<template>
  <ul>
    <li v-for="(directory, index) in directories" :key="`first-${index}`">
      <details>
        <summary @click="updatePath(directory.fullPath)" tabindex="0">{{ directory.name }}</summary>
        <DirTree @updatePath="updatePath" :nodes="directory.children" :editor="editor" />
      </details>
    </li>
    <li
      tabindex="0"
      v-for="(file, index) in files"
      :key="`second-${index}`"
      @click="openFile(file)"
    >{{ file.name }}</li>
  </ul>
</template>

<script>
import { getFile } from "../modules/http";

export default {
  name: "DirTree",
  props: {
    nodes: Array,
    editor: Object,
    pathInputEl: HTMLInputElement
  },
  computed: {
    directories() {
      return this.nodes.filter(node => {
        return node.isDir;
      });
    },
    files() {
      return this.nodes.filter(node => {
        return node.isFile && node.isAllowedSuffix;
      });
    }
  },
  methods: {
    /**
     * @param{DirNode}fileNode
     */
    async openFile(fileNode) {
      const res = await getFile(fileNode);
      this.editor.setValue(res);
      this.$emit("updatePath", fileNode.fullPath);
    },
    /**
     * @param{string}newPath
     */
    updatePath(newPath) {
      this.$emit("updatePath", newPath);
    }
  }
};
</script>

<style scoped>
summary {
  font-weight: bolder;
}

ul {
  list-style-type: none;
  padding-left: 10px;
}

li {
  white-space: nowrap;
}

li:focus,
summary:focus {
  background-color: lightcyan;
}
</style>
