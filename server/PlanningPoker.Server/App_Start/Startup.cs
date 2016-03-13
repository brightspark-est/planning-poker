using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(PlanningPoker.Startup), "ConfigureSignalR")]


namespace PlanningPoker
{
    public static class Startup
    {
        public static void ConfigureSignalR(IAppBuilder app)
        {
            // For more information on how to configure your application using OWIN startup, visit http://go.microsoft.com/fwlink/?LinkID=316888

             app.MapSignalR();
        }
    }
}