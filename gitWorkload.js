var http = require("http");
const iconv = require("iconv-lite");
const key = "R94UYGC7wFsxNWfGRoyB";
const queryProjectName = "g-crm-app";
var request = require("request");
getData();
("/api/v4/projects/项目id/repository/branches?private_token=xxx");

async function getData() {
  const projectUrl = `http://49.234.245.235/api/v4/projects/?private_token=${key}`;
  const projectRes = await FetchUtil(projectUrl);
  const project =
    projectRes?.filter((item) => item?.name === queryProjectName)[0] || {};
  getBranchList(project?.id);
  getCommitList(project?.id);
}

//获取分支
function getBranchList(projectId) {
  FetchUtil(
    `http://49.234.245.235/api/v4/projects/${projectId}/repository/branches?private_token=${key}`
  ).then((res) => {});
}
//获取提交数量
function getCommitList(projectId, branch = "dev") {
  let commitData = {};
  FetchUtil(
    `http://49.234.245.235/api/v4/projects/${projectId}/repository/commits?ref_name=${branch}&private_token=${key}`
  ).then((res) => {
    const commitAccount = res.filter(
      (item) => item.title?.slice(0, 5) !== "Merge"
    );

    res?.map(async (item, index) => {
      if (item.title?.slice(0, 5) === "Merge") {
        return;
      }
      const { author_name, id } = item;
      if (!commitData[author_name]) {
        commitData[author_name] = {
          commit: {
            additions: 0,
            deletions: 0,
            total: 0,
          },
        };
      }
      new Promise.all([
        await getCommitDetails(projectId, id),
        await getCommitDetails(projectId, id),
      ]);
      const commitDetails = await getCommitDetails(projectId, id);
      const { stats } = commitDetails;
      commitData[author_name].commit = {
        additions: commitData[author_name].commit.additions + stats?.additions,
        deletions: commitData[author_name].commit.deletions + stats?.deletions,
        total: commitData[author_name].commit.total + stats?.total,
      };
      if (index + 1 === res?.length) {
        console.log("commitData--->", commitData);
      }
    });
  });
}

//获取提交详情
async function getCommitDetails(projectId, commitId) {
  return await FetchUtil(
    `http://49.234.245.235/api/v4/projects/${projectId}/repository/commits/${commitId}?private_token=${key}`
  );
}

function FetchUtil(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let datas = [];
        let size = 0;
        res.on("data", (data) => {
          datas.push(data);
          size += data.length;
        });
        res.on("end", function () {
          let data = [];
          if (datas.length === 0) {
            returnErr("请换个关键词试试吧~", userName, bot);
          }
          let buff = Buffer.concat(datas, size);
          const result = iconv.decode(buff, "utf8") || [];
          resolve(JSON.parse(result));
        });
      })
      .on("error", (err) => {
        console.log("数据搜索失败====>" + err);
      });
  });
}
