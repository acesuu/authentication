const asyncHandler = require('express-async-handler')
const { find } = require('../model/goalModel')

const Goal = require('../model/goalModel')
const User = require('../model/userModel')

//@DESC get goals
//@ROUTE GET /api/goals
//@ACCESS   Private
const getGoals = asyncHandler(async (req, res) =>{
    const goals = await Goal.find({user: req.user.id})

    // res.status(200).json({message: 'get goals'})
    res.status(200).json(goals)

})

//@DESC set goals
//@ROUTE POST /api/goals
//@ACCESS   Private
const setGoals = asyncHandler( async (req, res) =>{

    // console.log(req.body)

    if(!req.body.text){
        res.status(400)
        throw new Error('please add a text field')
    }

    const goal = await Goal.create({ 
        text: req.body.text,
        user: req.user.id,
    })

    // res.status(200).json({message: 'set goals'})
    res.status(200).json(goal)
})

//@DESC update goals
//@ROUTE PUT /api/goals/:id
//@ACCESS   Private
const updateGoals = asyncHandler(async (req, res) =>{
    
    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }
    
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('user not found')
    }
    //make sure the logged in user matches the goal user
    if(goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('user not authorized')
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body,{
        new: true
    })
    // res.status(200).json({message: `Update goals ${req.params.id}`})
    res.status(200).json(updatedGoal)
})

//@DESC delete goals
//@ROUTE DELETE /api/goals/:id
//@ACCESS   Private
const deleteGoals = asyncHandler(async (req, res) =>{
    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('user not found')
    }
    //make sure the logged in user matches the goal user
    if(goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('user not authorized')
    }
    await goal.remove()
    
    // res.status(200).json({message: `Delete goals ${req.params.id}`})

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getGoals,
    setGoals,
    updateGoals,
    deleteGoals
}