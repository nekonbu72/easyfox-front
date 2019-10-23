<template>
  <ul>
    <li v-for="(directory, index) in directories" :key="`first-${index}`">
      <details>
        <summary @click="updatePath(directory.fullPath)" tabindex="0">{{ directory.name }}</summary>
        <DirTree @updatePath="updatePath" :trees="directory.children" :editor="editor" />
      </details>
    </li>
    <li
      tabindex="0"
      v-for="(file, index) in files"
      :key="`second-${index}`"
      @click="open(file)"
    >{{ file.name }}</li>
  </ul>
</template>

<script>
import { getFile, DirTree as Tree } from "../modules/http";

export default {
  name: "DirTree",
  props: {
    trees: Array,
    editor: Object
  },
  computed: {
    directories() {
      return this.trees.filter(content => {
        return content.isDir;
      });
    },

    files() {
      return this.trees.filter(content => {
        return content.isFile && content.isAllowedSuffix;
      });
    }
  },
  methods: {
    /**
     * @param{Tree}file
     */
    async open(file) {
      const res = await getFile(file);
      this.editor.setValue(res);
      this.$emit("updatePath", file.fullPath);
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
