import Tournament from "../../../models/tournament-model.js";
import Stage from "../../../models/stage-model.js";

const groupController = {
   async post__create(req, res) {
      try {
         console.log(req.body);
         let data = req.body;
         data.creator = req.user.id;
         data.tournament = req.params.id;
         console.log(data);
         console.log(req.params);
         let group = await Tournament.createGroup(data);
         if (!group) return res.json({ message: "Группа не создана, ошибка" });
         return res.json({ message: "Группа создана" });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка: " + e.message });
      }
   },
   async get__group_edit(req, res) {
      try {
         let groupId = req.params.id;
         let group = await Tournament.findOne({ _id: groupId });
         if (!group) return res.json({ message: "Группа не найдена" });
         return res.json({ group });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка: " + e.message });
      }
   },
};

export default groupController;
