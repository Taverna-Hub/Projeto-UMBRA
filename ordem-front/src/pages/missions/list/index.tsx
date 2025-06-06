import { Helmet } from 'react-helmet-async';
import * as S from './styles';
import { Navigation } from '../../../components/Navigation';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
  Mission,
  MissionService,
} from '../../../services/http/missions/MissionService';
import { useState } from 'react';

export function Missions() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: missions } = useQuery({
    queryKey: ['missions'],
    queryFn: () => MissionService.findAll(),
  });

  const filteredMissions = missions?.filter((mission: Mission) => {
    const matchesSearch =
      searchTerm === '' ||
      mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.status.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  function handleGoToMission(id: string) {
    navigate(`/missoes/${id}`);
  }

  return (
    <S.Wrapper>
      <Helmet title="Missões" />
      <h1>Missões</h1>

      <S.SearchInterface>
        <Input
          placeholder="Procure uma missão..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Button onClick={() => navigate('/missoes/criar')}>Criar missão</Button>
      </S.SearchInterface>

      <S.TableContainer>
        <S.Table>
          <S.TableHead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Objetivo</th>
              <th>Data de começo</th>
              <th>Equipe</th>
              <th>Status</th>
            </tr>
          </S.TableHead>
          <tbody>
            {filteredMissions &&
              filteredMissions.map((mission: Mission, index: number) => {
                return (
                  <>
                    <S.TableRow
                      onClick={() => handleGoToMission(mission.id_mission)}
                    >
                      <td>
                        <span>{index + 1}</span>
                      </td>
                      <td>
                        <p>{mission.title}</p>
                      </td>
                      <td>
                        <p>{mission.objective}</p>
                      </td>
                      <td>
                        <p>
                          {new Date(mission.start_date).toLocaleDateString(
                            'pt-br',
                          )}
                        </p>
                      </td>
                      <td>
                        <p>{mission.team_name || 'Sem Equipe'}</p>
                      </td>
                      <td>
                        <div className={`status ${mission.status}`}>
                          <p>{mission.status}</p>
                        </div>
                      </td>
                    </S.TableRow>
                  </>
                );
              })}
          </tbody>
        </S.Table>
      </S.TableContainer>

      <Navigation />
    </S.Wrapper>
  );
}
