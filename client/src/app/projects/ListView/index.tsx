import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import { Task, useGetTasksQuery } from '@/state/api';
import React from 'react'

type ListProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};
const ListView = ({id, setIsModalNewTaskOpen}: ListProps) => {
    const {data:tasks,error,isLoading}=useGetTasksQuery({projectId: Number(id)})
    if(isLoading) return <div>Loading...</div>
    if(error) return <div>An error occured while fetching tasks.</div>
  return (
    <div className='pb-8 px-4 xl:px-6'>
        <div className='pt-5'>
            <Header name='List' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
            {tasks?.map((task:Task)=> <TaskCard key={task.id} task={task}/>)}
        </div>
    </div>
  )
}

export default ListView