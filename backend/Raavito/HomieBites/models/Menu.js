import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema(
  {
    categories: [
      {
        id: String,
        name: String,
        description: String,
        items: [
          {
            id: String,
            name: String,
            price: Number,
            description: String,
            available: { type: Boolean, default: true },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure only one menu document exists
menuSchema.statics.getMenu = async function () {
  let menu = await this.findOne();
  if (!menu) {
    menu = await this.create({ categories: [] });
  }
  return menu;
};

export default mongoose.model('HomieBites_Menu', menuSchema);

