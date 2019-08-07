import { gql } from 'apollo-boost';

const getSeriesQuery = gql`
    {
        series {
            title
            description
            images{
                poster
            }
            followers
            seasons 
            episodes 
            creation 
            length 
            network 
            status
        }
    }
`;

const getSeriesTitlesQuery = gql`
    {
        series {
            title
            followers
        }
    }
`;

const getSerieQuery = gql`
    query GetSerie($title: String){
        serie(title: $title) {
            id
            title
        }
    }
`;

export { 
    getSerieQuery,
    getSeriesQuery,
    getSeriesTitlesQuery,
};
