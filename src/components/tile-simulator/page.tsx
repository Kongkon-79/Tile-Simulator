import TileSimulatorHeader from "./_components/tile-simulator-header";


const TileSimulator = () => {
  return (
    <div className="pb-10">
      <div className="container">
        <h1 className="text-[32px] font-semibold text-[#5B5B5B] leading-[120%] text-center py-10">
          Select a collection, Select a pattern, Edit your color, <br/> and see the
          look in the preview section.
        </h1>
        <div>
          <TileSimulatorHeader/>
        </div>
      </div>
    </div>
  );
};

export default TileSimulator;
