module.exports={
    apps: [
        {
            name: "project-management" ,
            script: "npm",
            ARGS: "run dev",
            env: {
                NODE_ENV:"development",
            }
        }
    ]
}