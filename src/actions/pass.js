import Action from "./action.js";

module.exports = class Pass extends Action {
	
   constructor(player, ball, trajectory, target, whiteboard) {
	   super(utmlObject, whiteboard);
   }
   
   execute()
   {
	   return new Reaction(this);
   }
}