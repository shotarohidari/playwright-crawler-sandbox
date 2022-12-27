#!/usr/bin/env node
import inquirer from 'inquirer';
const answers = await inquirer.prompt([
  {
    type:"input",
    name: "rootUrl",
    message: "クローリングするURLを入力してください。",
    validate(input:string) {
      if(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(input)) {
        return true;
      }
      throw new Error("正しいURLを入力してください");   
    }
  }
]);

// クローリングを始める
const rootUrl = answers["rootUrl"];
console.log(`クローリングを開始します。\nURL:${rootUrl}`);
console.log("クローリング中...(未実装)");
console.log("クローリングが完了しました");

// スクレイピングを始める

// 完了を知らせる