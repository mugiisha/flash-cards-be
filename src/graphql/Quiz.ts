import { objectType, extendType, nonNull,stringArg } from "nexus";
import { resolveImportPath } from "nexus/dist/utils";
import { NexusGenObjects } from "../../nexus-typegen";


export const Quiz = objectType({
    name: "Quiz",
    definition(t) {
        t.nonNull.int('id')
        t.nonNull.string('question')
        t.nonNull.string('answer')
        t.field('postedBy', {
            type:'User',
            resolve(parent, args, context, info) {
                return context.prisma.quiz
                .findUnique({
                    where: {
                       id: parent.id 
                    }
                })
                .postedBy();
            }
        })
    },
})

export const QuizQuery = extendType({
    type: 'Query',
    definition(t){
        t.nonNull.list.nonNull.field('quizes',{
            type:'Quiz',
            resolve(parent,args,context,info){
                return context.prisma.quiz.findMany()
            }
        })
    }
})

export const QuizMutation = extendType({
    type:'Mutation',
    definition(t) {
        t.nonNull.field('post', {
            type: 'Quiz',
            args: {
                question: nonNull(stringArg()),
                answer: nonNull(stringArg())
            },
            resolve(parent,args,context){
                const {question,answer} = args
                const {userId} =  context

                if(!userId){
                    throw new Error('you must be logged in to create a quiz')
                }

                const newQuiz = context.prisma.quiz.create({
                    data: {
                    question:question,
                    answer: answer,
                    postedBy: {connect: {id:userId}}
                    } 
                })
                return newQuiz
            }
        }),
        t.nonNull.field('delete', {
            type: 'Quiz',
            args: {
                id: nonNull(stringArg())
            },
            resolve(parent,args,context){
                const {id} = args
                const quiz = context.prisma.quiz.delete({
                    where: {
                        id:Number(id)
                    }
                })
                return quiz
            }

        }),
        t.nonNull.field('update', {
            type: 'Quiz',
            args: {
                id: nonNull(stringArg()),
                question: nonNull(stringArg()),
                answer: nonNull(stringArg())
            },
            resolve(parent,args,context){
                const {id,question,answer} = args

                const updatedQuiz = context.prisma.quiz.update({
                    where: {
                        id:Number(id)
                    },data: {
                        question:question,
                        answer:answer
                    }
                })
                return updatedQuiz
            }

        })

    },

})




