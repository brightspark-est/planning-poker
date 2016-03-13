using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace PlanningPoker.Hubs
{
    [HubName("pokerTable")]
    public class PokerTableHub : Hub
    {
        private static Dictionary<string, string> _players = new Dictionary<string, string>();

        private static Dictionary<string, string> _bets = new Dictionary<string, string>(); 

        /// <summary>
        /// 
        /// </summary>
        /// <param name="name"></param>
        public void Join(string name)
        {
            var cid = Context.ConnectionId;
            if (_players.ContainsKey(cid))
            {
                return;
            }

            _players[cid] = name;
            Clients.All.notifyNewPlayer(cid, name);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="val"></param>
        public void Bet(string val)
        {
            var cid = Context.ConnectionId;
            _bets[cid] = val;
            Clients.All.hasMadeBet(cid);
            if (_bets.Count == _players.Count)
            {
                Turn();
            }
        }

        /// <summary>
        /// 
        /// </summary>
        public void Reset()
        {
            _bets.Clear();
            Clients.All.reset();
        }

        /// <summary>
        /// Returns all players already around the table
        /// </summary>
        /// <returns></returns>
        public Dictionary<string, string> GetAllPlayers()
        {
            return _players;
        }


        private void Turn()
        {
            Clients.All.turn(_bets);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var cid = Context.ConnectionId;
            if (_players.ContainsKey(cid))
            {
                Clients.All.notifyPlayerLeft(cid);
                _players.Remove(cid);
            }

            if (_bets.ContainsKey(cid))
            {
                _bets.Remove(cid);
            }

            if (_bets.Count == _players.Count)
            {
                Turn();
            }

            return base.OnDisconnected(stopCalled);
        }
    }
}