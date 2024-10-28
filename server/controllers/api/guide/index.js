import Team from "../../../models/team-model.js";
import Doc from "../../../models/doc-model.js";

class GuideController {
   async get__create(req, res) {
      try {
         if (!req.user.isAdmin) return res.json({ message: "Нет доступа" });

         return sendRes("partials/lk_part/guide_create", {}, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }

   async post__create(req, res) {
      try {
         let data = req.body;
         data.creator = req.user.id;
         data.type = "guide";

         let guide = await Doc.create(data);
         console.log(guide);
         return res.json({ message: "Справочник создан" });
      } catch (e) {
         console.log(e);
         if (e.codeName == "BSONObjectTooLarge")
            return res.json({ message: "Превышен лимит вводимых данных" });
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async get__single_guide(req, res) {
      try {
         let guide = await Doc.findById(req.params.id);
         return sendRes("partials/lk_part/guide_single", { guide }, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
}
async function sendRes(path, data, res) {
   return res.render(path, data, function (err, html) {
      if (err) console.log(err);
      res.json(html);
   });
}

export default new GuideController();
