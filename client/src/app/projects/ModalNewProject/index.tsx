import { useCreateProjectsMutation } from '@/state/api';
import React, { useState } from 'react'

type Props = {
    isOpen: boolean;
    onClose: ()=> void;
}

const ModalNewProject = ({isOpen, onClose}: Props) => {
    const[createProject, {isLoading}] =useCreateProjectsMutation();
    const [projectName, setProjectName]=useState("");
    const [description, setDescription]=useState("");
    const [startDate, setStartDate]=useState("");
    const [endDate, setEndDate]=useState("");


  return (
    <div>ModalNewProject</div>
  )
}

export default ModalNewProject