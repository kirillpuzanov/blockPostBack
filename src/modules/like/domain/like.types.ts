export enum LikeStaus {
  None = "None",
  Like = "Like",
  Dislike = "Dislike",
}

export const LikeInput = {
  likeStatus: LikeStaus,
};

export type LikeInfo = {
  likesCount: number;
  dislikesCount: number;
};

export type LikeInfoWithStatus = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStaus;
};

export type LikeDb = {
  parentId: string;
  createdAt: Date;
  status: LikeStaus;
  author: {
    userId: string;
    userLogin: string;
  };
};

export type UserLikes = Record<string, LikeStaus>;

//
// // Создаем отдельную коллекцию для хранения счетчиков
// const CounterSchema = new mongoose.Schema({
//   parentId: { type: String, required: true, unique: true },
//   likesCount: { type: Number, default: 0 },
//   dislikesCount: { type: Number, default: 0 },
//   lastUpdated: { type: Date, default: Date.now }
// });
//
// const CounterModel = mongoose.model('Counter', CounterSchema);
//
// async function updateLikeStatusWithCounter(
//   parentId: string,
//   userId: string,
//   userLogin: string,
//   newStatus: string
// ) {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//
//   try {
//     const existingLike = await LikeModel.findOne({
//       parentId,
//       'author.userId': userId
//     }).session(session);
//
//     const oldStatus = existingLike?.status;
//
//     // Если статус не изменился
//     if (oldStatus === newStatus) {
//       await session.commitTransaction();
//       return;
//     }
//
//     // Обновляем или удаляем лайк
//     if (newStatus === 'none') {
//       if (existingLike) {
//         await LikeModel.deleteOne({ _id: existingLike._id }).session(session);
//       }
//     } else {
//       await LikeModel.findOneAndUpdate(
//         { parentId, 'author.userId': userId },
//         {
//           parentId,
//           'author.userId': userId,
//           'author.userLogin': userLogin,
//           status: newStatus,
//           createdAt: new Date()
//         },
//         { upsert: true, session }
//       );
//     }
//
//     // Атомарно обновляем счетчики
//     const updateOperations: any = {};
//
//     if (oldStatus === 'like') updateOperations.$inc = { likesCount: -1 };
//     if (oldStatus === 'dislike') updateOperations.$inc = { dislikesCount: -1 };
//
//     if (newStatus === 'like') {
//       updateOperations.$inc = updateOperations.$inc || {};
//       updateOperations.$inc.likesCount = (updateOperations.$inc.likesCount || 0) + 1;
//     }
//     if (newStatus === 'dislike') {
//       updateOperations.$inc = updateOperations.$inc || {};
//       updateOperations.$inc.dislikesCount = (updateOperations.$inc.dislikesCount || 0) + 1;
//     }
//
//     if (Object.keys(updateOperations).length > 0) {
//       await CounterModel.findOneAndUpdate(
//         { parentId },
//         { ...updateOperations, $set: { lastUpdated: new Date() } },
//         { upsert: true, session }
//       );
//     }
//
//     await session.commitTransaction();
//
//     // Получаем актуальные счетчики
//     const counters = await CounterModel.findOne({ parentId });
//     return {
//       likesCount: counters?.likesCount || 0,
//       dislikesCount: counters?.dislikesCount || 0
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     session.endSession();
//   }
// }
