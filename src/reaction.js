import Action from "./action.js";

module.exports = class Reaction extends Action {
	
   constructor(utmlObject, whiteboard) {
	   super(utmlObject, whiteboard);
   }
   
   execute()
   {
	   return new Reaction(this);
   }
}