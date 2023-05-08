const express = require("express");

const app = express();

const db = require("./models/index.js");

const { Member } = db;

app.use(express.json()); //middleware, express.use(express.json());
// 서버로 온 리퀘스트의 바디에, json데이터가 존재할 경우에 그것을 추출해서 리퀘스트의 바디의
// 바디 프로퍼티 값으로 설정해준다. 이런식으로 request가 라우터핸들러에 의해 처리되기전에 추가적으로 전 처리를 위한 함수를 미들웨어라고 한다.

app.get("/api/members", async (req, res) => {
  const { team } = req.query;
  if (team) {
    const teamMembers = await Member.findAll({ where: { team: team } });
    res.send(teamMembers);
  } else {
    const members = await Member.findAll();
    res.send(members);
  }
});

app.get("/api/members/:id", async (req, res) => {
  // 이렇게 :id처럼 변하는 것을 route parameter라고 함.
  // const id = req.params.id; 원래는 이런식으로 만듬, 아래값과 동일
  const { id } = req.params;
  const member = await Member.findOne({ where: { id } });
  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ message: "There is no such with the id!!" });
  }
});

app.post("/api/members/", async (req, res) => {
  const newMember = req.body;
  const member = Member.build(newMember);
  await member.save();
  res.send(member);
});

// app.put("/api/members/:id", async (req, res) => {
//   const { id } = req.params;
//   const newInfo = req.body;
//   const result = await Member.update(newInfo, { where: { id } });
//   if (result[0]) {
//     res.send({ message: `${result[0]} row(s) affected` });
//   } else {
//     res.status(404).send({ message: "There is no member with the id" });
//   }
// });

app.put("/api/members/:id", async (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const member = await Member.findOne({ where: { id } });
  Object.keys(newInfo).forEach((prop) => {
    member[prop] = newInfo[prop];
  });
  await member.save();
  res.send(member);
});

app.delete("/api/members/:id", async (req, res) => {
  const { id } = req.params;
  const deletedCount = await Member.destroy({ where: { id } });
  if (deletedCount) {
    res.send({ message: `${deletedCount} row(s) deleted` });
  } else {
    res.status(404).send({ message: "There is no member with the id!" });
  }
});

app.listen(3000, () => {
  console.log("server is listening...");
});
