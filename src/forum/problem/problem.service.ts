import { Injectable } from '@nestjs/common';
import { SearchProblemDto } from './dtos/search-problem.dto';
import { Problem } from './schemas/problem.schema';
import { CreateProblemDto } from './dtos/create-problem.dto';
import { UpdateProblemDto } from './dtos/update-problem.Dto';

@Injectable()
export class ProblemService {

    createProblem(newProblem:CreateProblemDto):Problem{
        const problem = null 
        return problem
    }

    updateProblem(newProblem:UpdateProblemDto):Problem{
        const problem = null //findbyID AND Update
        return problem
    }

    searchProblem(searchProblemDto:SearchProblemDto):Problem{
        const {title,tags,status} = searchProblemDto;
        let problems = null
        if(title){
            //problem filter query and assign it to var
        }else if (tags){
            //problem filter query and assign it to var
        }else if(status){
            //problem filter query and assign it to var
        }
        return problems
    }

    getAllProblem():Problem[]{
        let problems = [] //query to find all
        return problems
    }
    getProblem(id:string):Problem[]{
        let problems = null //query to find by ID
        return problems
    }
    
    deleteProblem(id:string):Problem{
        const problem = null //findbyID AND Del
        return problem
    }
}
